using backend.Services;
using FluentAssertions;
using Xunit;

namespace backend.Tests.Services;

public class PasswordHasherServiceTests
{
    private readonly PasswordHasherService _sut; // System Under Test

    public PasswordHasherServiceTests()
    {
        _sut = new PasswordHasherService();
    }

    [Fact]
    public void HashPassword_ShouldReturnHashedString()
    {
        // Arrange
        var password = "SuperSecretPassword123!";

        // Act
        var hash = _sut.HashPassword(password);

        // Assert
        hash.Should().NotBeNullOrEmpty();
        hash.Should().NotBe(password); // The hash should not be the plain text password
    }

    [Fact]
    public void VerifyPassword_GivenCorrectPassword_ShouldReturnTrue()
    {
        // Arrange
        var password = "SuperSecretPassword123!";
        var hash = _sut.HashPassword(password);

        // Act
        var result = _sut.VerifyPassword(password, hash);

        // Assert
        result.Should().BeTrue();
    }

    [Fact]
    public void VerifyPassword_GivenIncorrectPassword_ShouldReturnFalse()
    {
        // Arrange
        var password = "SuperSecretPassword123!";
        var wrongPassword = "WrongPassword!";
        var hash = _sut.HashPassword(password);

        // Act
        var result = _sut.VerifyPassword(wrongPassword, hash);

        // Assert
        result.Should().BeFalse();
    }
}