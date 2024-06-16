
from langchain_core.prompts import PromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv
import os
from langchain_core.pydantic_v1 import BaseModel, Field, HttpUrl
from typing import List

import json
#parser
from langchain.schema.output_parser import StrOutputParser
from langchain_core.output_parsers import JsonOutputParser


# sql
from langchain_community.utilities import SQLDatabase
from langchain.chains import create_sql_query_chain
from langchain_community.tools.sql_database.tool import QuerySQLDataBaseTool
from langchain_community.agent_toolkits import SQLDatabaseToolkit

#prompt 
from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import RunnablePassthrough
from operator import itemgetter
import requests

from datetime import datetime,timezone

from utils.db import connection_pool

load_dotenv()
# os.environ["LANGCHAIN_TRACING_V2"]="true"
os.environ["LANGCHAIN_API_KEY"]=os.getenv("LANGCHAIN_API_KEY")
os.environ["GOOGLE_API_KEY"]=os.getenv("GOOGLE_API_KEY")

llm=ChatGoogleGenerativeAI(model="gemini-pro")


class Ans(BaseModel):
    xValues:List= Field(description="A List of values that can be ploted on x axis of a line graph.")
    yValues:List = Field(description="""A List of values that can be ploated on y axis of a line graph.""")


parser = JsonOutputParser(pydantic_object=Ans)

def search_giphy( query, limit=2):
    try:
      url = "https://api.giphy.com/v1/gifs/search"
      params = {
        "api_key": os.getenv('GIPPY_API'),
        "q": query.dict()['content'],
        "limit": 1
      }
      response = requests.get(url, params=params)
      if response.status_code == 200:
          data = response.json()
          gif_urls = [gif['images']['original']['url'] for gif in data['data']]
          return gif_urls
      else:
          print("Failed to retrieve GIFs: ", response.status_code)
          return []
    except:
      return [];
def process_GIF_ACTION(main_msg,query):
  api_query=llm.invoke("can you write a search keyword that i can use to search a gif in order to respond to user following message: "+ query)
  main_msg["url"]=search_giphy(api_query)


# if the event is record event then we need to parse the given query
text_to_time_stamp=PromptTemplate.from_template(""""
todays date and time is {timestamp}
Give the following message:{message} please convert any mention of date+time into a timestamp
""")
prompt=PromptTemplate.from_template(
    """I have a sql database which store the information of users health data it has following tables
  table 1 : activity_records: (
    Discription of table : This table stores the record of different activity (exercises) performed by the user.
    it has following columns
 column Name | data type
 user_id     | integer
 title       | character varying(255)
 description | text
 timestamp   | timestamp without time zone
 calories    | numeric(9,2)
 picture     | character varying(255)
 duration    | numeric(5,2)
  )


 table 2 : blood_glucose_records: (
    Discription of table: This table store the record of blood glucose or blood sugar level.
    it has following table
 column Name   | data type
 glucose_level | numeric(5,2)
 timestamp     | timestamp without time zone
 user_id       | integer
 )
  table 3 : height_records :(
    Discription of table: This table store the record of height of user.
    it has following table
 column Name           | data type
 user_id               | integer
 recorded_at_timestamp | timestamp without time zone
 height                | numeric(5,2)

  )
  table 4 : reminders :(
       Discription of table: This table store the record of differnet reminders set by user.
    it has following table
 column Name | data type
     user_id | integer
 title       | character varying(255)
 description | text
 remind_time | timestamp without time zone
  )
  table 5 : sleep_records :(
     Discription of table: This table store the record of sleep logs for user.
    it has following table
 column Name | data type
 user_id          | integer
 sleep_time       | numeric(5,2)
 sleep_start_time | timestamp without time zone
 sleep_end_time   | timestamp without time zone

  )
  table 6: water_log:(
     Discription of table: This table store the record  for water intake by a user .
    it has following table
 column Name | data type
 user_id   | integer
 quantity  | numeric(5,2)
 timestamp | timestamp without time zone


  )
  weight_records :(
    Discription of table: This table store the record of weight records for a user .
    it has following table
           column Name | data type
 user_id               | integer
 recorded_at_timestamp | timestamp without time zone
 weight                | numeric(5,2)

  )

  Please read the following message {message} and properly format in following format in json \n

      Note:STRICTLY DO NOT FAKE INFORMATION if some data is not present then do not include it

    (
      table_name:select only one name of the table from above,
      columns:Value of coulmn and corresponding values
    )

    """
)
prompt_json = PromptTemplate(
            template="Strictly only format the information given to you in json format below \n{format_instructions}\n{message}\n Note no matter what the data needs to be valid json. It is very very critical system. Please make sure that data is in valid json",
            input_variables=["message"],
            partial_variables={"format_instructions": parser.get_format_instructions()},
        )

recprd_parsing_chain=text_to_time_stamp|llm|prompt|llm

def process_RECORD_DATA_ACTION(main_msg,query,userID):
  data=recprd_parsing_chain.invoke({"timestamp":datetime.utcnow().isoformat(),"message":query+" my user id is "+str(userID)}).dict()['content'];
  def parse_output(output):
    try:
      data = json.loads(output)
      return data
    except json.JSONDecodeError:
      first_curly = output.find('{')
      last_curly = output.rfind('}')
      if first_curly != -1 and last_curly != -1:
        json_substring = output[first_curly:last_curly + 1]
        try:
          data = json.loads(json_substring)
          return data
        except json.JSONDecodeError:
          return None
      else:
        return None
  main_msg['data']=parse_output(data);





def get_weather_data(latitude, longitude):
  url = f"https://api.open-meteo.com/v1/forecast?latitude={latitude}&longitude={longitude}&hourly=temperature_2m,precipitation_probability,precipitation,rain,showers,snowfall&timezone=GMT"
  response = requests.get(url)
  response.raise_for_status()  # Ensure the request was successful
  data = response.json()
  return data


def get_current_time_stats(data):
  # Get current time
  current_time = datetime.utcnow().replace(minute=0, second=0, microsecond=0)
  current_time_str = current_time.strftime("%Y-%m-%d %H:00")

  # Extract current time data for all parameters
  current_data = {}
  for param in ["temperature_2m", "precipitation_probability", "precipitation", "rain", "showers", "snowfall"]:
    hourly_data = data["hourly"][param]
    for i, time in enumerate(data["hourly"]["time"]):
      if datetime.fromisoformat(time) == current_time:
        current_data[param] = hourly_data[i]
        break  # Exit loop after finding current time data

  return current_data


def process_WEATHER_ACTION(main_msg,user_id):
  connection=connection_pool.getconn();
  cursor = connection.cursor()
  cursor.execute(f"SELECT * from location_records where user_id={user_id} order by timestamp desc;")
  val= cursor.fetchone()
  cursor.close()
  url = f"https://api.bigdatacloud.net/data/reverse-geocode-client?latitude={val[2]}&longitude={val[3]}&localityLanguage=en"
  locationJson= requests.get(url)
  data = locationJson.json()
  city=data['city'];
  connection_pool.putconn(connection)
  current_weather_stats = get_current_time_stats(get_weather_data(val[2],val[3]))
  print(current_weather_stats)
  main_msg['Message']='Here\'s the weather data for you!'
  main_msg['data']=current_weather_stats
  main_msg['data']['Location']=city

#sql steps
#modify sql queyr
def modify_sql_query(response):
    # Modify the SQL query string here
    cleaned_sql_query = response.replace("```sql", "").replace("```", "").strip()
    return  cleaned_sql_query

db = SQLDatabase.from_uri("postgresql://fitness-mate_owner:P7adYmQxb2qj@ep-wispy-sun-a5jrvr5z.us-east-2.aws.neon.tech/fitness-mate?sslmode=require")
create_sql_query = create_sql_query_chain(llm, db)
execute_query=QuerySQLDataBaseTool(db=db)
sql_chain=create_sql_query|modify_sql_query|execute_query;

answer_prompt = PromptTemplate.from_template(
    """Given the following user question, corresponding SQL query, and SQL result, 
            If the query requires creating a line chart, reply as follows:
            "xValues": [10, 20, 40, ...], "yValues": [25, 24, 10, ...].
            if the xValues need to be time stamps also add it in proper way, please make the xValues and yValues an array online.

Question: {question}
SQL Query: {query}
SQL Result: {result}
Answer: """
)

sql_final_chain = (
    RunnablePassthrough.assign(query=create_sql_query).assign(
        result=itemgetter("query")|( modify_sql_query| execute_query)
    )|answer_prompt|llm
)


def process_SQL_QUERY_ACTION(main_msg,query,userID):
  def parse_output(output):
    try:
      data = json.loads(output)
      return data
    except json.JSONDecodeError:
      first_curly = output.find('{')
      last_curly = output.rfind('}')
      if first_curly != -1 and last_curly != -1:
        json_substring = output[first_curly:last_curly + 1]
        try:
          data = json.loads(json_substring)
          return data
        except json.JSONDecodeError:
          return None
      else:
        return None

  x = (
    RunnablePassthrough.assign(query=create_sql_query).assign(
        result=itemgetter("query")|( modify_sql_query| execute_query)
    )|answer_prompt)
  print(x.invoke({"question":query+" my user id is "+ str(userID) +" strictly use this id only  it is huge risk if use data from any other users. transform any question to only select data for my id only :"+str(userID)}))
  data=sql_final_chain.invoke({"question":query+" my user id is "+ str(userID) +" strictly use this id only  it is huge risk if use data from any other users. transform any question to only select data for my id only :"+str(userID)}).dict()['content'];
  main_msg['data']=parse_output(data);

