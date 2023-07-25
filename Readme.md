# Jobs Api 💼

### Register (POST Request)
**Endpoint:** `Domain/api/v1/auth/register`
##### Request Body: 
```json
  {
    "username": "<USERNAME>",
    "email":"<EMAIL>",
    "password" : "<PASSWORD>"
  }
```

### Login (POST Request)
**Endpoint:** `Domain/api/v1/auth/login`
##### Request Body: 
```json
  {
    "email":"<EMAIL>",
    "password" : "<PASSWORD>"
  }
```

### Create Job (POST Request)
**Endpoint:** `Domain/api/v1/jobs`
##### Request Body: 
```json
  {
    "company": "Google",
    "position": "Software Architecture"
  }
```
##### Response Body:
```json
  {
    "job": {
        "company": "Google",
        "position": "Software Architecture",
        "status": "Pending",
        "createdBy": "<USERID>",
        "_id": "<JOBID>",
        "createdAt": "2023-07-25T08:34:19.140Z",
        "updatedAt": "2023-07-25T08:34:19.140Z",
        "__v": 0
    }
  }
```

### Get Single Job (GET Request)
**Endpoint:** `Domain/api/v1/jobs/:id`
##### Response Body:
```json
  {
    "job": {
        "_id": "<JOBID>",
        "company": "Microsoft",
        "position": "intern",
        "status": "Pending",
        "createdBy": "<USERID>",
        "createdAt": "2023-07-24T18:59:46.170Z",
        "updatedAt": "2023-07-24T18:59:46.170Z",
        "__v": 0
    }
  }
```

### Get All Jobs (GET Request)
**Endpoint:** `Domain/api/v1/jobs`
#### Response Body:
```json
  [
    {
      "job": {
        "_id": "<JOBID>",
        "company": "Microsoft",
        "position": "intern",
        "status": "Pending",
        "createdBy": "<USERID>",
        "createdAt": "2023-07-24T18:59:46.170Z",
        "updatedAt": "2023-07-24T18:59:46.170Z",
        "__v": 0
      }
    },
    {
      "job": {
        "_id": "<JOBID>",
        "company": "Google",
        "position": "Software Architecture",
        "status": "Pending",
        "createdBy": "<USERID>",
        "createdAt": "2023-07-24T18:59:46.170Z",
        "updatedAt": "2023-07-24T18:59:46.170Z",
        "__v": 0
      }
    }
  ]
```

### Update Job (PATCH Request)
**Endpoint:** `Domain/api/v1/jobs/:id`
#### Request Body:
```json
  {
    "company": "Google",
    "position": "Software Engineer"
  }
```
#### Response Body:
```json
  {
    "job": {
      "_id": "<JOBID>",
      "company": "Google",
      "position": "Software Engineer",
      "status": "Pending",
      "createdBy": "<USERID>",
      "createdAt": "2023-07-24T18:59:46.170Z",
      "updatedAt": "2023-07-24T18:59:46.170Z",
      "__v": 0
    }
  }
```

### Delete Job (DELETE Request)
**Endpoint:** `Domain/api/v1/jobs/:id`
```json
  {
    "message": "The Job with id: { ID } has been deleted successfully"
  }
```

**<span style="color: blue">Note:</span>**
<span style="font-size: 14px">I followed this course: <a href="https://youtu.be/qwfE7fSVaZM">Node.js / Express Course - Build 4 Projects</a> to make this api using Node JS and Mongo DB</span>
