using System;
using System.Reflection;
using Api.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Test.Controllers;

public class UserControllerTest
{
    [Fact]
    public void ApiAttributeTest()
    {
        var contr = typeof(UserController);
        var attr = contr.GetCustomAttributes<ApiControllerAttribute>();
        Assert.NotEmpty(attr);
    }

    [Fact]
    public void AuthorizationAttributeTest()
    {
        var contr = typeof(UserController);
        var methods = contr.GetMethods(BindingFlags.Public | BindingFlags.Instance | BindingFlags.DeclaredOnly);
        foreach (var method in methods)
        {
            var attr = method.GetCustomAttributes();
            if (attr.Any(a => a.GetType() == typeof(HttpGetAttribute)))
            { 
                var authAttr= attr.FirstOrDefault(a => a.GetType() == typeof(AuthorizeAttribute)) as AuthorizeAttribute;
                Assert.NotNull(authAttr);
                Assert.Equal("administrator,editor", authAttr.Roles?.ToLower().Replace(" ", ""));
            }
            else
            {
                var authAttr = attr.FirstOrDefault(a => a.GetType() == typeof(AuthorizeAttribute)) as AuthorizeAttribute;
                Assert.NotNull(authAttr);
                Assert.Equal("Administrator", authAttr.Roles);
            }
        }
        
        
    }

}
