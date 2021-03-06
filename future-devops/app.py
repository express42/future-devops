"""Little REST service for finding closest email to array of emails.
"""
import hashlib
import json
import random
import falcon
import distance
from celery.result import AsyncResult
from tasks import compare

class LevensteinResource(object):
    """Resource to process all the requests.
    """

    def __init__(self):
        """Defines default variables.
        """
        self.max_winners = 15
        self.reset()

    def reset(self):
        """Resets variables to default
        """
        self.winners = []
        self.tools = set()
        self.emails = set()
        self.res = []
        self.response = []
        self.task_id = 0

    def find_winners(self):
        """Gets `max_winners` number of winners.
        """
        if not self.res:
            return

        how_many_winners_needed = self.max_winners - len(self.winners)
        if how_many_winners_needed < 0:
            return

        likely_winners = list(filter(lambda x: x[0] == min(self.res)[0], self.res))
        self.response.append({
            'emails_checked': '100.00%',
            'winners': [] + self.winners,
            'likely_winners': [] + likely_winners,
            'needed': how_many_winners_needed
            })

        if len(likely_winners) > how_many_winners_needed:
            tmp = random.sample(likely_winners, how_many_winners_needed)
            self.remove_from_res(tmp)
            self.winners += tmp
            self.response.append({
                'emails_checked': '100.00%',
                'winners': [] + self.winners,
                'likely_winners': [],
                'needed': 0
                })
        elif len(likely_winners) == how_many_winners_needed:
            self.remove_from_res(likely_winners)
            self.winners += likely_winners
            self.response.append({
                'emails_checked': '100.00%',
                'winners': [] + self.winners,
                'likely_winners': [],
                'needed': 0
                })
        else:
            self.remove_from_res(likely_winners)
            self.winners += likely_winners
            self.find_winners()

    def remove_from_res(self, lst):
        """Removes element of `lst` from `res` variable.
        """
        for element in lst:
            self.res.remove(element)

    def on_post(self, req, resp):
        """Handles POST requests
        """
        resp.status = falcon.HTTP_200
        if req.content_length:
            data = json.load(req.stream)
            self.reset()
            self.tools = set(filter(lambda x: x.strip() != '', data['tools']))
            self.emails = set(filter(lambda x: x.strip() != '', data['emails']))
            #self.compare()
            #self.find_winners()
            self.task_id = compare.delay(list(self.tools), list(self.emails)).id
        resp.body = str(self.task_id)

    def on_get(self, req, resp):
        """Handles GET requests
        """
        resp.status = falcon.HTTP_200
        task_result = AsyncResult(self.task_id)
        if (str(task_result.status) == "PENDING"):
            self.response = [{
                'emails_checked': '0.00%',
                'winners': [],
                'likely_winners': [],
                'needed': self.max_winners
                }]
        elif (str(task_result.status) == "PROGRESS"):
            self.response = [{
                'emails_checked': '{:.2%}'.format(task_result.result["progress"]),
                'winners': [],
                'likely_winners': [],
                'needed': self.max_winners
                }]
        else:
            self.response = [{
                'emails_checked': '100%',
                'winners': [],
                'likely_winners': [],
                'needed': self.max_winners
                }]
            self.res = task_result.result
            self.find_winners()
        resp.body = str(json.dumps(self.response))

api = application = falcon.API()

api.add_route('/levenstein', LevensteinResource())
