from flask import render_template
from flask.views import View
from urllib2 import urlopen
from mpadv import utils

import json


class Party(View):
    methods = ['GET']

    def dispatch_request(self, party_slug):
        ''' Get declarations for a given party.
        :param party_slug: slug value of the party.
        '''
        api_url = utils.get_api_url()

        request_url = "%s/aggregate/party/%s" % (api_url, party_slug)
        print request_url

        response = urlopen(request_url).read()

        asset_declarations = json.loads(response)
        ad_results = asset_declarations['result']

        return render_template('party.html', asset_declarations=ad_results)
