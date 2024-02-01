FROM python:3.7

ARG REQUIREMENTS_TXT_PATH
WORKDIR /app

COPY $REQUIREMENTS_TXT_PATH ./

RUN pip install -r requirements.txt

EXPOSE 5000

CMD sh -c "python main.py"