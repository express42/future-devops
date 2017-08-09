"""Async worker for compare emails to tools using Levenstein distance
"""
import hashlib
import celery
import distance

app = celery.Celery('tasks', broker='redis://localhost:6379/0', backend='redis://localhost:6379/0')

@app.task(bind=True)
def compare(self, tools, emails):
    """Compares every email to list of tools.
    """
    res = []
    emails_len = len(emails)
    emails_counter = 0
    for email in emails:
        email_hash = hashlib.sha512(email.encode('utf-8')).hexdigest()
        possible_winner = (len(email_hash), email, 'none')
        for tool in tools:
            tool_hash = hashlib.sha512(tool.encode('utf-8')).hexdigest()
            count = distance.levenshtein(tool_hash, email_hash)
            if count < possible_winner[0]:
                possible_winner = (count, email, tool)
        emails_counter += 1
        self.update_state(state="PROGRESS", meta={'progress': emails_counter/emails_len})
        res.append(possible_winner)
    return res
