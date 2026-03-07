namespace backend.Data.Entities
{
    public class Category
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = "";
        public ICollection<Event> Events { get; set; } = new HashSet<Event>();
    }
}