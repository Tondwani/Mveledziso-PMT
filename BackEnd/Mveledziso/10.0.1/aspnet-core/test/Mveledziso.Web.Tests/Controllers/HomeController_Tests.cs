using Mveledziso.Models.TokenAuth;
using Mveledziso.Web.Controllers;
using Shouldly;
using System.Threading.Tasks;
using Xunit;

namespace Mveledziso.Web.Tests.Controllers;

public class HomeController_Tests : MveledzisoWebTestBase
{
    [Fact]
    public async Task Index_Test()
    {
        await AuthenticateAsync(null, new AuthenticateModel
        {
            UserNameOrEmailAddress = "admin",
            Password = "123qwe"
        });

        //Act
        var response = await GetResponseAsStringAsync(
            GetUrl<HomeController>(nameof(HomeController.Index))
        );

        //Assert
        response.ShouldNotBeNullOrEmpty();
    }
}