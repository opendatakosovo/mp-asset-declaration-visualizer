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
        party_sum_declarations = self.get_aggregate_sum_declarations(party_slug)
        party_mps_declarations = self.get_asset_declarations_of_all_party_mps(party_slug)

        declared_years = self.get_aggregate_declarared_years(party_slug)
        mps_who_declared = declared_years['declared']['mps']
        declaration_years = sorted(declared_years['declared']['years'])

        return render_template(
            'party.html',
            asset_declarations=party_sum_declarations,
            party_mps_declarations=party_mps_declarations,
            mps_who_declared=mps_who_declared,
            declaration_years=declaration_years)

    def get_aggregate_sum_declarations(self, party_slug):
        ''' Get the aggregate declrations for the given Party.
        :param party_slug: slug of the party name.
        '''
        api_url = utils.get_api_url()

        request_url = "%s/aggregate/sum/%s" % (api_url, party_slug)

        response = urlopen(request_url).read()

        asset_declarations = json.loads(response)
        ad_results = asset_declarations['result']

        return ad_results

    def get_asset_declarations_of_all_party_mps(self, party_slug):
        ''' Get the asset declarations for all MPs of the given Party.
        :param party_slug: slug of the party name.
        '''
        api_url = utils.get_api_url()

        request_url = "%s/%s?sort=year+asc,mp.slug+asc" % (api_url, party_slug)

        response = urlopen(request_url).read()

        asset_declarations = json.loads(response)

        return asset_declarations

    def get_aggregate_declarared_years(self, party_slug):
        ''' Get the aggregate declrations for the given Party.
        :param party_slug: slug of the party name.
        '''
        api_url = utils.get_api_url()

        request_url = "%s/aggregate/years-mps-declared/%s" % (api_url, party_slug)

        response = urlopen(request_url).read()

        declared_years = json.loads(response)

        return declared_years
