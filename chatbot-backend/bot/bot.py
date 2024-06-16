import os
import json
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.tools import BaseTool, StructuredTool, tool
from typing import List
from langgraph.prebuilt import chat_agent_executor
from langchain_community.tools import YouTubeSearchTool


#pubmd 
from langchain_community.tools.pubmed.tool import PubmedQueryRun

# sql
from langchain_community.utilities import SQLDatabase
from langchain.chains import create_sql_query_chain
from langchain_community.tools.sql_database.tool import QuerySQLDataBaseTool
from langchain_community.agent_toolkits import SQLDatabaseToolkit

#prompt 
from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import RunnablePassthrough
from operator import itemgetter

#parser
from langchain.schema.output_parser import StrOutputParser
from langchain_core.output_parsers import JsonOutputParser

#pydantic 
from langchain_core.pydantic_v1 import BaseModel, Field, HttpUrl

#process functions 
from bot.process_output import process_GIF_ACTION,process_RECORD_DATA_ACTION,process_WEATHER_ACTION,process_SQL_QUERY_ACTION
load_dotenv()
# os.environ["LANGCHAIN_TRACING_V2"]="true"
os.environ["LANGCHAIN_API_KEY"]=os.getenv("LANGCHAIN_API_KEY")
os.environ["GOOGLE_API_KEY"]=os.getenv("GOOGLE_API_KEY")


class Ans(BaseModel):
    Message: str = Field(description="Plain text human readable response to users messages.")
    Action: str|None = Field(description="""A ENUM feild. Strictly choose on of the following values
    ['YOUTUBE',
    'WEATHER',
    'RECORD-DATA','GIF','QUERY-SQL']""")
    url:List[str]|None =  Field(description="""Include list of urls that might be present here"""
    )

class Chatbot:
    def __init__(self):
        self.llm=ChatGoogleGenerativeAI(model="gemini-pro")
        self.tools=[self.youtube_video_search,self.meidcal_informaton_search,self.query_sql_data_for_health_stats,self.recording_tool,self.search_giphy_for_GIF_Funny,self.get_weather_tool]
        self.agent_executor = chat_agent_executor.create_tool_calling_executor(self.llm, self.tools)
        self.parser = JsonOutputParser(pydantic_object=Ans)
        self.prompt = PromptTemplate(
            template="Strictly only format the information given to you in json format below \n{format_instructions}\n{query}\n Note no matter what the data needs to be valid json. It is very very critical system. Please make sure that data is in valid json",
            input_variables=["query"],
            partial_variables={"format_instructions": self.parser.get_format_instructions()},
        )
        self.final_agent_chain=RunnablePassthrough.assign(messages=itemgetter('query'))|self.agent_executor|RunnablePassthrough.assign(query=itemgetter('messages'))|self.prompt|self.llm



    @tool
    def youtube_video_search(query:str)->List[str]:
        """Description: Use this tool to quickly find YouTube videos use this whenever users wants to learn anything. When users ask for tutorials or fun content, input their query to get relevant video links.
            When to Use: Whenever users inquire about tutorials or entertaining videos."""
        return  "Following action needs to be executed YOUTUBE"+ json.dumps(YouTubeSearchTool().run(query,5))
    @tool
    def meidcal_informaton_search(query:str)->List[str]:
        """Biomedical Literature Search
            Description: Harnessing over 35 million citations from MEDLINE, life science journals, and online books, this tool offers a comprehensive resource for biomedical literature. Citations may include links to full-text content from PubMed Central and publisher websites.
        When to Use: Utilize this tool to address any medical query. Whether users seek information on diseases, treatments, medications, or any other medical topic, input their query to access a wealth of relevant literature and resources."""
        return   PubmedQueryRun().invoke(query)

    @tool
    def recording_tool(query:str)->str:

        """ You have ability to record new user data. this needs to be used when user only wants to record not when users asks question. I have a sql database which store the information of users health data it has following tables
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
        timestamp   | timestamp without time zone
        )
        table 5 : sleep_records :(
            Discription of table: This table store the record of sleep logs for user.
            it has following table
        column Name | data type
        user_id          | integer
        sleep_duration   | numeric(5,2)

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
        user_id             | integer
        timestamp           | timestamp without time zone
        weight              | numeric(5,2)

        )
        use this tool when user request / talks about data that might be inserted or probably inserted in any one of the above tables.
        Description: Use this tool to record user data effectively. When users express a desire to record specific information, input their data into this tool to ensure it is stored accurately.
        When to Use: Whenever users want to record or log information, utilize this tool to capture and save their data reliably."""
        return "Following action needs to be executed RECORD-DATA please ask user to confirm the data they have entered ";

    @tool
    def query_sql_data_for_health_stats(question:str)->str:
        """You have ability to query sql database. Call this tool whenever user asks for data about activity_records,blood_glucose_records, height_records,height_records. I have a sql database which store the information of users health data it has following tables
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
            timestamp   | timestamp without time zone
            )
            table 5 : sleep_records :(
                Discription of table: This table store the record of sleep logs for user.
                it has following table
            column Name | data type
            user_id          | integer
            sleep_duration   | numeric(5,2)

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
            timestamp             | timestamp without time zone
            weight                | numeric(5,2)

            )

            Description: When users asks for any health related data please use this.This tool takes user queries and searches health databases to provide personalized health information. Input the user's query to retrieve relevant health data tailored to their personal questions.
            When to Use: Use this tool when users have specific personal health questions. It is ideal for providing detailed, individualized health information.
            """
        def modify_sql_query(response):
            # Modify the SQL query string here
            cleaned_sql_query = response.replace("```sql", "").replace("```", "").strip()
            return  cleaned_sql_query

        llm=ChatGoogleGenerativeAI(model="gemini-pro")
        db = SQLDatabase.from_uri("postgresql://fitness-mate_owner:P7adYmQxb2qj@ep-wispy-sun-a5jrvr5z.us-east-2.aws.neon.tech/fitness-mate?sslmode=require")
        create_sql_query = create_sql_query_chain(llm, db)
        execute_query=QuerySQLDataBaseTool(db=db)

            
        answer_prompt = PromptTemplate.from_template(
                """Given the following user question, corresponding SQL query, and SQL result, answer the user question.

            Question: {question}
            SQL Query: {query}
            SQL Result: {result}
            Answer: """
            )

        sql_finaL_chain = (
                RunnablePassthrough.assign(query=create_sql_query).assign(
                    result=itemgetter("query")|( modify_sql_query| execute_query)
                )
                | answer_prompt
                | llm
                | StrOutputParser()
            )
        return sql_finaL_chain.invoke({"question":question})+ 'ACTION REQUIRED is SQL-QUERY'

    @tool
    def search_giphy_for_GIF_Funny(query:str)->List[str]:
        """
            use this while greeting users, use this when users makes a casual comment,
            Use this tools when you want to make the conversion friendly and funny uing gifs. use this tool to create friendly chat with user.
            use this tool if you feel that response to users message is theorettically but casual,
        """
        llm=ChatGoogleGenerativeAI(model="gemini-pro")
        return llm.invoke(query)+"ACTION REQUIRED is GIF"
    
    @tool
    def get_weather_tool(query:str)->List[str]:
        """
        this tool can be used to check weather you have the functionality for weather 
        this tool can look up weather / temprature /rain wind information for user. This tool can be used to look up any weather information
        Use this tool to get weather information. when ever user refrences to weather, use this tool to get weather information.
        """
        return "ACTION REQUIRED is WEATHER"
 



def take_action(main_msg,query,userID):
  if main_msg['Action'] == 'WEATHER':
    return process_WEATHER_ACTION(main_msg,userID)
  if main_msg['Action'] == 'RECORD-DATA':
    return process_RECORD_DATA_ACTION(main_msg,query,userID)
  elif main_msg['Action']=='GIF':
    return process_GIF_ACTION(main_msg,query)
  elif main_msg['Action']=='QUERY-SQL':
    return process_SQL_QUERY_ACTION(main_msg,query,userID)

bot=Chatbot()
def process_msg(query,userID):
    main_msg=bot.final_agent_chain.invoke({"query":query}).dict()['content'];
    def parse_output(output,query):
        llm=ChatGoogleGenerativeAI(model="gemini-pro")
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
                    return {"Message":llm.invoke(query),"Action":None}
            else:
                return {"Message":llm.invoke(query),"Action":None}

    main_msg=parse_output(main_msg,query);
    take_action(main_msg,query,userID);
    return main_msg