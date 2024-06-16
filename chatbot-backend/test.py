import os
from langchain_community.tools.tavily_search import TavilySearchResults
from langchain_google_genai import ChatGoogleGenerativeAI
from langgraph.prebuilt import chat_agent_executor
from langchain.schema.output_parser import StrOutputParser
from langchain.output_parsers.combining import CombiningOutputParser
from dotenv import load_dotenv

load_dotenv()
print(os.getenv("LANGCHAIN_API_KEY"))

os.environ["LANGCHAIN_TRACING_V2"]="true"
os.environ["LANGCHAIN_API_KEY"]=os.getenv("LANGCHAIN_API_KEY")
os.environ["GOOGLE_API_KEY"]=os.getenv("GOOGLE_API_KEY")
os.environ["TAVILY_API_KEY"]=os.getenv("TAVILY_API_KEY")

search = TavilySearchResults(max_results=5)
llm=ChatGoogleGenerativeAI(model="gemini-pro")

tools = [search]
agent_executor = chat_agent_executor.create_tool_calling_executor(llm, tools)

ans=agent_executor.invoke({"messages":"what is the long form of usa?"})
