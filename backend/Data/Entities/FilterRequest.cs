namespace backend.Data.Entities;
using System.Reflection;
public class FilterRequest
{
    public string Title { get; set; } = "";
    public string Description { get; set; } = "";
    public DateTime StartDate { get; set; } = DateTime.MinValue;
    public int MaxAttendees { get; set; }
    public int CurrentAttendees { get; set; }
    public int Price { get; set; }
    public string Location { get; set; } = "";
    public bool ShowFull { get; set; } = false;

}
public static class ObjectExtension
{
     public static bool AllFieldsEmpty(this object obj)
    {
        if (obj == null) return true;

        return obj.GetType()
            .GetProperties(BindingFlags.Public | BindingFlags.Instance)
            .All(p => {
                var value = p.GetValue(obj);
                var defaultValue = p.PropertyType.IsValueType 
                                   ? Activator.CreateInstance(p.PropertyType) 
                                   : null;
                return Equals(value, defaultValue);
            });
    }
}
