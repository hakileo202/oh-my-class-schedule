import pandas as pd
import sys

try:
    # Try reading as excel
    df = pd.read_excel("tests/课表.xls", header=None)
    print(df.to_string())
except Exception as e:
    print(f"Error reading excel: {e}")
