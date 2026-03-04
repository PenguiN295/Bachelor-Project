
using System.Text.RegularExpressions;


public static partial class SlugService
{
    public static string Generate(string title, Guid id)
    {
        if (string.IsNullOrWhiteSpace(title)) return id.ToString().Split('-')[0];
        string slug = title.ToLowerInvariant().Trim();
        slug = MyRegex().Replace(slug, "");
        slug = MyRegex1().Replace(slug, "-").Trim('-');
        string shortId = id.ToString().Split('-')[0];
        return $"{slug}-{shortId}";
    }

    [GeneratedRegex(@"[^a-z0-9\s-]")]
    private static partial Regex MyRegex();
    [GeneratedRegex(@"[\s-]+")]
    private static partial Regex MyRegex1();
}