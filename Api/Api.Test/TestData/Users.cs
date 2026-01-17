using System;

namespace Api.Test;

public static partial class TestData
{

    public static List<User> Users = new List<User>()
    {
        new () { Id =1, Fullname="Administrator", Login ="admin", Password = "1", CanDelete=false, Role = Models.Auth.UserRole.Administrator},
        new () { Id =1, Fullname="Editor", Login ="editor", Password = "1", CanDelete=true, Role = Models.Auth.UserRole.Editor},
        new () { Id =1, Fullname="User", Login ="user", Password = "1", CanDelete=true, Role = Models.Auth.UserRole.User},
    };

}
