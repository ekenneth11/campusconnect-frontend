

class activityLogModel{
    constructor(user, action, target){
        this.user = user;
        this.action = action;
        this.target = target;
    }
}

export default activityLogModel;