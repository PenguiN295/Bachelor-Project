using FluentAssertions;
using System;
using Xunit;

namespace backend.Tests.Services;

public class SlugServiceTests
{
    [Fact]
    public void Generate_GivenValidTitleAndId_ShouldReturnKebabCaseSlugWithShortId()
    {
        // Arrange
        var title = "My Awesome Event!";
        var id = Guid.Parse("12345678-1234-1234-1234-123456789012");

        // Act
        var result = SlugService.Generate(title, id);

        // Assert
        result.Should().Be("my-awesome-event-12345678");
    }

    [Fact]
    public void Generate_GivenEmptyTitle_ShouldReturnOnlyShortId()
    {
        // Arrange
        var title = "   ";
        var id = Guid.Parse("87654321-4321-4321-4321-210987654321");

        // Act
        var result = SlugService.Generate(title, id);

        // Assert
        result.Should().Be("87654321");
    }

    [Fact]
    public void Generate_GivenTitleWithSpecialCharacters_ShouldRemoveSpecialCharacters()
    {
        // Arrange
        var title = "Event @ Bucharest #2026!";
        var id = Guid.Parse("11111111-2222-3333-4444-555555555555");

        // Act
        var result = SlugService.Generate(title, id);

        // Assert
        result.Should().Be("event-bucharest-2026-11111111");
    }
}