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

        party_declarations = self.get_aggregate_declarations(party_slug)

        #pm_declarations = self.get_pm_declarations(party_slug)

        return render_template(
            'aggregate_declarations.html',
            asset_declarations=party_declarations,
            pm_asset_declarations=None)

    def get_aggregate_declarations(self, party_slug):
        ''' Get the aggregate declrations for the given Party.
        :param party_slug: slug of the party name.
        '''
        api_url = utils.get_api_url()

        request_url = "%s/aggregate/%s" % (api_url, party_slug)

        response = urlopen(request_url).read()

        asset_declarations = json.loads(response)
        ad_results = asset_declarations['result']

        return ad_results

    def get_pm_declarations(self, party_slug):
        api_url = utils.get_api_url()

        request_url = "%s/%s" % (api_url, party_slug)

        response = urlopen(request_url).read()

        asset_declarations = json.loads(response)
        ad_results = asset_declarations['result']

        return ad_results
