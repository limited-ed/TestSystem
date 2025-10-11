using System;
using System.Threading.Tasks;
using Api.Data;
using Api.Repositories;
using Api.Service;
using Microsoft.EntityFrameworkCore;
using Moq;
using Moq.EntityFrameworkCore;

namespace Api.Test.Repository;

public class UserRepositoryTest
{

    private readonly DataContext _dataContext;
    private readonly UserRepository _service;
    private readonly GroupRepository _serviceGroup;
 
    public UserRepositoryTest()
    {
        var options = new DbContextOptionsBuilder<DataContext>()
            .UseInMemoryDatabase(databaseName: "TestDb")
            .Options;
        _dataContext = new DataContext(options);
        DataSeed.Seed(_dataContext);
        _serviceGroup = new GroupRepository(_dataContext);
        _service = new UserRepository(_dataContext, _serviceGroup);
    }

    [Fact]
    public async Task GetAll()
    {
        var users = await _service.GetAllAsync();
        Assert.Equal(5, users.Count());
    }

    [Fact]
    public async Task GetAll_ForUser_Top_Administrator()
    {
        var users = await _service.GetAllForUser(1);
        Assert.Equal(5, users.Count());
    }
    
    [Fact]
    public async Task GetAll_ForUser_Group_Administrator()
    {
        var users = await _service.GetAllForUser(3);
        Assert.Equal(4, users.Count());
    }
    
    
}
