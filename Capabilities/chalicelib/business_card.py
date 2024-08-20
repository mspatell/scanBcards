import json

class BusinessCard:

    def __init__(self,
                 user_id=None,
                 card_id=None,
                 names='',
                 telephone_numbers=None,
                 email_addresses=None,
                 company_name='',
                 company_website='',
                 company_address='',
                 image_storage=''):

        self.user_id = user_id
        self.card_id = card_id
        self.names = str(names)
        self.telephone_numbers = telephone_numbers if telephone_numbers is not None else []
        self.email_addresses = email_addresses if email_addresses is not None else []
        self.company_name = company_name
        self.company_website = company_website
        self.company_address = company_address
        self.image_storage = image_storage

        self.names = self._format_strings(self.names, all_caps=True)
        self.company_address = self._format_strings(self.company_address)

    def _format_strings(self, value, all_caps=False):
        response = str(value).strip()
        if all_caps:
            response = response.capitalize()
        return response

    def __repr__(self):
        return json.dumps(self, default=lambda o: o.__dict__, sort_keys=True, indent=4)

    def __str__(self):
        return json.dumps(self, default=lambda o: o.__dict__, sort_keys=True, indent=4)

    def toDynamoFormat(self, isUpdate=False):
        """Converts the BusinessCard object to a format suitable for DynamoDB"""

        item = {
            'user_id': {'S': str(self.user_id)},
            'card_id': {'S': str(self.card_id)},
            'card_names': {'S': self.names},
            'company_name': {'S': self.company_name},
            'company_website': {'S': str(self.company_website)},
            'company_address': {'S': self.company_address},
            'image_storage': {'S': self.image_storage},
        }

        # Add telephone_numbers and email_addresses if they are not empty
        if self.telephone_numbers:
            item['telephone_numbers'] = {'SS': [str(tn) for tn in self.telephone_numbers]}
        if self.email_addresses:
            item['email_addresses'] = {'SS': self.email_addresses}

        if isUpdate:
            item = {k: {'Value': v, 'Action': 'PUT'} for k, v in item.items()}
        
        return item
