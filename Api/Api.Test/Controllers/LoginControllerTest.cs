using System;
using System.Reflection;
using Api.Controllers;
using Microsoft.AspNetCore.Mvc;

namespace Api.Test.Controllers;

public class LoginControllerTest
{
    [Fact]
    public void AttributeTest()
    {
        var contr = typeof(LoginController);
        var attr = contr.GetCustomAttributes<ApiControllerAttribute>();
        Assert.NotEmpty(attr);
    }
}
