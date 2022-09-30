import AccessControl from 'accesscontrol';

const accessControl = new AccessControl();

// project
accessControl
  .grant('owner')
  .createAny('project')
  .readOwn('project')
  .updateOwn('project', ['*', '!date'])
  .deleteOwn('project');

accessControl
  .deny('owner')
  .readAny('project')
  .updateAny('project', ['*', '!date'])
  .deleteAny('project');

accessControl
  .grant('member')
  .readOwn('project')
  .updateOwn('project', ['*', '!date', '!invited_people', '!owner', '!status']);

accessControl
  .deny('member')
  .createAny('project')
  .createOwn('project')
  .readAny('project')
  .updateAny('project')
  .deleteAny('project')
  .deleteOwn('project');

accessControl
  .grant('invited')
  .updateOwn('project', ['members', 'invited_people']);

accessControl
  .deny('invited')
  .createAny('project')
  .createOwn('project')
  .readAny('project')
  .readOwn('project')
  .updateAny('project')
  .deleteAny('project')
  .deleteOwn('project');

accessControl
  .deny('empty')
  .createAny('project')
  .createOwn('project')
  .readAny('project')
  .readOwn('project')
  .updateAny('project')
  .updateOwn('project')
  .deleteAny('project')
  .deleteOwn('project');

// userProfile
accessControl
  .grant('user')
  .readAny('userProfile', ['*', '!githubID', '!authToken']);
accessControl
  .deny('user')
  .updateAny('userProfile')
  .createAny('userProfile')
  .deleteAny('userProfile');

accessControl
  .grant('user')
  .readOwn('userProfile', ['*', '!githubID', '!authToken'])
  .updateOwn('userProfile', ['*', '!githubID', '!authToken'])
  .createOwn('userProfile')
  .deleteOwn('userProfile');

export default accessControl;
