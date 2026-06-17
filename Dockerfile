FROM python:3.11

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

COPY pyproject.toml uv.lock ./

RUN python -m pip install --no-cache-dir --upgrade pip && \
    python -m pip install --no-cache-dir uv && \
    uv sync --frozen --no-dev

COPY alembic.ini main.py ./
COPY alembic ./alembic
COPY app ./app

EXPOSE 8000

ENV HOST=0.0.0.0
ENV PORT=8000

CMD ["uv", "run", "python", "main.py"]
