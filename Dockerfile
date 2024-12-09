FROM node:18 AS front-end-builder
WORKDIR /app/scicomm-front
COPY scicomm-front/package*.json ./
RUN npm install --legacy-peer-deps
COPY scicomm-front/ ./
RUN npm run build


FROM python:3.13
WORKDIR /code
COPY scicomm-back/requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt
COPY scicomm-back/ /code
COPY --from=front-end-builder /app/scicomm-front/out /code/out
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80"]