import boto3
from botocore.exceptions import ClientError

class StorageService:
    def __init__(self, storage_location):
        self.client = boto3.client('s3')
        self.bucket_name = storage_location

    def get_storage_location(self):
        return self.bucket_name

    def upload_file(self, file_bytes, file_name, acl='private'):
        try:
            self.client.put_object(
                Bucket=self.bucket_name,
                Body=file_bytes,
                Key=file_name,
                ACL=acl
            )
            
            # Generate a presigned URL for the uploaded file
            file_url = self.client.generate_presigned_url(
                'get_object',
                Params={'Bucket': self.bucket_name, 'Key': file_name},
                ExpiresIn=3600  # URL expires in 1 hour
            )

            return {'fileId': file_name, 'fileUrl': file_url}

        except ClientError as e:
            print(f"An error occurred: {e}")
            return {'error': str(e)}
