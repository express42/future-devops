"""Little REST service for finding closest email to array of emails.
"""
import hashlib
import json
import falcon
import distance

class LevensteinResource(object):
    """Resource to process all the requests.
    """

    def __init__(self):
        """Defines default variables.
        """
        self.max_winners = 2
        self.reset()

    def reset(self):
        """Resets variables to default
        """
        self.winners = []
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

    def on_post(self, req, resp):
        """Handles GET requests
        """
        resp.status = falcon.HTTP_200
        if req.content_length:
            data = json.load(req.stream)
            self.reset()
            self.tools = data['tools']
            self.emails = data['emails']
            self.compare()
        resp.body = str(self.res)

api = application = falcon.API()

api.add_route('/levenstein', LevensteinResource())