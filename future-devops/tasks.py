"""Async worker for compare emails to tools using Levenstein distance
"""
import hashlib
import celery
import distance
import os

app = celery.Celery(
    'tasks',
    broker='redis://{}:6379/0'.format(os.environ['REDIS_HOST']),
    backend='redis://{}:6379/0'.format(os.environ['REDIS_HOST'])
)

@app.task(bind=True)
def compare(self, tools, emails):
    """Compares every email to list of tools.
    """
    res = []
    emails_len = len(emails)
    emails_counter = 0
    tools_hashed = {}
    for tool in tools:
        tools_hashed[tool] = hashlib.sha512(tool.encode('utf-8')).hexdigest()
    for email in emails:
        email_hash = hashlib.sha512(email.encode('utf-8')).hexdigest()
        possible_winner = (len(email_hash), email, 'none')
        for tool in tools_hashed:
            count = distance.levenshtein(
                tools_hashed[tool],
                email_hash,
                max_dist=possible_winner[0]
            )
            if 0 <= count < possible_winner[0]:
                possible_winner = (count, email, tool)
        emails_counter += 1
        self.update_state(state="PROGRESS", meta={'progress': emails_counter/emails_len})
        res.append(possible_winner)
    return res
