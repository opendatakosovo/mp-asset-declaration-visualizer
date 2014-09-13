from flask import Response
from flask.views import View
from urllib2 import urlopen
from mpadv import utils


class MPsGroupedByParties(View):
    methods = ['GET']

    def dispatch_request(self):
        ''' Get declarations for a given party and MP.
        '''
        api_url = utils.get_api_url()

        request_url = "%s/aggregate/mps-grouped-by-parties" % api_url

        mps_grouped_by_parties = urlopen(request_url).read()

        results = mps_grouped_by_parties

        # Build response object.
        resp = Response(
            response=results, mimetype='application/json')

        # Return response.
        return resp
