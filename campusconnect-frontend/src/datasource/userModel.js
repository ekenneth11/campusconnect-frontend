class userModel{
    constructor(firstName, lastName, email, username, password, role, created) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.role = role;
        this.created = created;
    }
}

export default userModel;