import boto3
import uuid

from chalicelib.business_card import BusinessCard
from chalicelib.business_card_list import BusinessCardList

class DynamoService:
    """Service to manage interaction with AWS DynamoDB"""

    def __init__(self, table_name):
        self.table_name = table_name
        self.dynamodb = boto3.client('dynamodb', 'ca-central-1')

    def store_card(self, card: BusinessCard):
        card.card_id = str(uuid.uuid4())
        item = card.toDynamoFormat()

        try:
            response = self.dynamodb.put_item(TableName=self.table_name, Item=item)
            return response['ResponseMetadata']['HTTPStatusCode'] == 200
        except Exception as e:
            print(f"Error storing item: {e}")
            return False

    def update_card(self, card: BusinessCard):
        try:
            response = self.dynamodb.update_item(
                TableName=self.table_name,
                Key={'user_id': {'S': str(card.user_id)}, 'card_id': {'S': str(card.card_id)}},
                AttributeUpdates=card.toDynamoFormat(isUpdate=True),
                ReturnValues='ALL_NEW'
            )
            return response['ResponseMetadata']['HTTPStatusCode'] == 200
        except Exception as e:
            print(f"Error updating item: {e}")
            return False

    def delete_card(self, user_id, card_id):
        try:
            response = self.dynamodb.delete_item(
                TableName=self.table_name,
                Key={'user_id': {'S': str(user_id)}, 'card_id': {'S': str(card_id)}}
            )
            return response['ResponseMetadata']['HTTPStatusCode'] == 200
        except Exception as e:
            print(f"Error deleting item: {e}")
            return False

    def get_card(self, user_id, card_id):
        try:
            response = self.dynamodb.get_item(
                TableName=self.table_name,
                Key={'user_id': {'S': str(user_id)}, 'card_id': {'S': str(card_id)}}
            )
            if 'Item' in response:
                return BusinessCard(
                    user_id=response['Item']['user_id']['S'],
                    card_id=response['Item']['card_id']['S'],
                    names=response['Item']['card_names']['S'],
                    email_addresses=response['Item']['email_addresses']['SS'],
                    telephone_numbers=response['Item']['telephone_numbers']['NS'],
                    company_name=response['Item']['company_name']['S'],
                    company_website=response['Item']['company_website']['S'],
                    company_address=response['Item']['company_address']['S'],
                    image_storage=response['Item']['image_storage']['S'],
                )
            return None
        except Exception as e:
            print(f"Error retrieving item: {e}")
            return None

    def search_cards(self, user_id, filter='', page=1, pagesize=10):
        if not user_id:
            raise ValueError('user_id is a mandatory field')

        try:
            expression_attribute_values = {
                ':user_id': {'S': user_id}
            }
            filter_expression = None

            if filter:
                filter_expression = (
                    'contains(card_names,:filter_criteria) OR '
                    'contains(email_addresses,:filter_criteria) OR '
                    'contains(company_name,:filter_criteria) OR '
                    'contains(company_website,:filter_criteria) OR '
                    'contains(company_address,:filter_criteria)'
                )
                expression_attribute_values[':filter_criteria'] = {'S': filter}

            response = self.dynamodb.query(
                TableName=self.table_name,
                KeyConditionExpression='user_id = :user_id',
                FilterExpression=filter_expression,
                ExpressionAttributeValues=expression_attribute_values,
                Limit=pagesize,
                ExclusiveStartKey=None  # Handle pagination with proper logic
            )
            return response
        except Exception as e:
            print(f"Error querying items: {e}")
            return None
