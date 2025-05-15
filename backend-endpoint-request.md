# Backend Endpoint Request: ProjectManager/GetByUserId

## Overview
We need a new endpoint in the ProjectManagerAppService to retrieve a ProjectManager entity by its associated UserId. This will help map the current logged-in user to their ProjectManager entity.

## Endpoint Details

- **Service**: ProjectManagerAppService
- **Method Name**: GetByUserId 
- **HTTP Method**: GET
- **Route**: `/api/services/app/ProjectManager/GetByUserId`
- **Parameters**: 
  - `userId` (type: long) - The ABP User ID to look up

## Expected Response
The endpoint should return a ProjectManagerDto with the following structure:

```json
{
  "id": "guid-string",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "userId": number
}
```

## Implementation Details

The method should:
1. Accept a userId parameter
2. Query the ProjectManager repository to find a ProjectManager with the matching UserId
3. Return null or throw a user-friendly exception if no matching ProjectManager is found
4. Map the found ProjectManager to a ProjectManagerDto and return it

## Example Implementation

```csharp
[HttpGet]
public async Task<ProjectManagerDto> GetByUserId(long userId)
{
    var projectManager = await Repository.FirstOrDefaultAsync(pm => pm.UserId == userId);
    
    if (projectManager == null)
    {
        throw new UserFriendlyException(L("ProjectManagerNotFound"));
    }

    return MapToEntityDto(projectManager);
}
```

## Use Case
This endpoint will be used to retrieve the ProjectManager entity associated with the currently logged-in user, allowing us to set the correct ProjectManagerId when creating new projects. 