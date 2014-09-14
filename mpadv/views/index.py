from flask import render_template
from flask.views import View
from urllib2 import urlopen
from mpadv import utils

import json


class Index(View):

    methods = ['GET']

    def dispatch_request(self):
        party_aggregate_medians = self.get_aggregate_medians()
        party_aggregate_sums = self.get_aggregate_sums()

        years_parties_declared = self.get_aggregate_declared_years()
        parties_who_declared = years_parties_declared['declared']['parties']
        declaration_years = sorted(years_parties_declared['declared']['years'])

        return render_template(
            'index.html',
            medians=party_aggregate_medians,
            sums=party_aggregate_sums,
            parties_who_declared=parties_who_declared,
            declaration_years=declaration_years)

    def get_aggregate_medians(self):
        api_url = utils.get_api_url()

        request_url = "%s/aggregate/median" % api_url

        response = urlopen(request_url).read()

        medians = json.loads(response)

        return medians

    def get_aggregate_sums(self):
        api_url = utils.get_api_url()

        request_url = "%s/aggregate/sum" % api_url

        response = urlopen(request_url).read()

        sums = json.loads(response)

        return sums

    def get_aggregate_declared_years(self):
        ''' Get the aggregate declrations for the given Party.
        :param party_slug: slug of the party name.
        '''
        api_url = utils.get_api_url()

        request_url = "%s/aggregate/years-parties-declared" % api_url

        response = urlopen(request_url).read()

        declared_years = json.loads(response)

        return declared_years
