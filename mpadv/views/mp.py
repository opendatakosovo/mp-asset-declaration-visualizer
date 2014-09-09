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
        api_url = utils.get_api_url()

        request_url = "%s/party/%s/mp/%s" % (api_url, party_slug, mp_name_slug)

        response = urlopen(request_url).read()

        asset_declarations = json.loads(response)

        return render_template('mp.html', asset_declarations=asset_declarations)
