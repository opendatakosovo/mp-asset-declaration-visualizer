from flask import render_template
from flask.views import View
from urllib2 import urlopen
from mpadv import utils

import json


class MP(View):
    methods = ['GET']

    def dispatch_request(self, party_slug, mp_name_slug):
        ''' Get declarations for a given party and MP.
        :param party_slug: slug value of the party.
        :param mp_name_slug: slug value of the MP's name.
        '''
        ad_results = self.get_mp_asset_declarations(party_slug, mp_name_slug)
        declared_years = self.get_mp_asset_declaration_years(party_slug, mp_name_slug)

        return render_template(
            'mp.html',
            declared_years=declared_years,
            asset_declarations=ad_results)

    def get_mp_asset_declarations(self, party_slug, mp_name_slug):
        '''
        '''
        api_url = utils.get_api_url()

        request_url = "%s/aggregate/sum/%s/%s" % (api_url, party_slug, mp_name_slug)

        response = urlopen(request_url).read()

        asset_declarations = json.loads(response)
        ad_results = asset_declarations['result']

        return ad_results

    def get_mp_asset_declaration_years(self, party_slug, mp_name_slug):
        '''
        '''
        api_url = utils.get_api_url()

        request_url = "%s/aggregate/years-mps-declared/%s/%s" % (api_url, party_slug, mp_name_slug)

        response = urlopen(request_url).read()

        years_declared = json.loads(response)

        return years_declared
