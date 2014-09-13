from flask import render_template
from flask.views import View
from urllib2 import urlopen
from mpadv import utils

import json


class Index(View):

    methods = ['GET']

    def dispatch_request(self):
        api_url = utils.get_api_url()

        request_url = "%s/aggregate/median" % api_url

        response = urlopen(request_url).read()

        medians = json.loads(response)

        return render_template('index.html', medians=medians)
