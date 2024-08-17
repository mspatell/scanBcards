from collections import defaultdict
import boto3
from botocore.exceptions import BotoCoreError, ClientError
import sys


class NamedEntityRecognitionService:
    def __init__(self):
        self.comprehendmedical = boto3.client('comprehendmedical')
        self.comprehend = boto3.client('comprehend')
        
    def detect_entities(self, text):
        response_list = defaultdict(list)
        try:
            # Detect entities using Amazon Comprehend
            comprehend_response = self.comprehend.detect_entities(
                Text=text,
                LanguageCode='en'
            )
            for record in comprehend_response['Entities']:
                if record['Type'] == 'PERSON':
                    response_list['name'].append(record['Text'])
            
            # Detect entities using Amazon Comprehend Medical
            comprehend_medical_response = self.comprehendmedical.detect_entities(
                Text=text
            )
            for record in comprehend_medical_response['Entities']:
                if record['Category'] == 'PROTECTED_HEALTH_INFORMATION':
                    entity_type = record['Type'].lower()
                    response_list[entity_type].append(record['Text'])
            
            # Remove duplicates by converting lists to sets and back to lists
            for key in response_list:
                response_list[key] = list(set(response_list[key]))
            
            return response_list

        except (BotoCoreError, ClientError) as error:
            print(error)
            sys.exit(-1)