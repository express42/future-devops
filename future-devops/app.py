"""Little REST service for finding closest email to array of emails.
"""
import hashlib
import falcon
import distance

class LevensteinResource(object):
    """Resource to process all the requests.
    """

    def __init__(self):
        """Defines default variables.
        """
        self.tools = []
        self.emails = []
        self.res = []

    def compare(self):
        """Compares every email to list of tools. 
        """
        for tool in self.tools:
            tool_hash = hashlib.sha512(tool.encode('utf-8')).hexdigest()
            for email in self.emails:
                email_hash = hashlib.sha512(email.encode('utf-8')).hexdigest()
                count = distance.levenshtein(tool_hash, email_hash)
                self.res.append((count, tool, email))

api = application = falcon.API()