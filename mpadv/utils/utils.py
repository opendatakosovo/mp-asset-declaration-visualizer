from flask import current_app


class Utils(object):

    def __init__(self):
        pass

    @staticmethod
    def get_api_url():
        ''' Get MP Asset Declaration data access API URL.
        '''
        api_url = current_app.config['API_MP_ASSET_DECLARATIONS']

        return api_url
