using Microsoft.EntityFrameworkCore.Migrations;
using NetTopologySuite.Geometries;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class PointGeometry : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
        ALTER TABLE ""Events"" 
        ALTER COLUMN ""Location"" 
        TYPE geometry(Point, 4326) 
        USING ""Location""::geometry;
    ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<Point>(
                name: "Location",
                table: "Events",
                type: "geography",
                nullable: false,
                oldClrType: typeof(Point),
                oldType: "geometry(Point, 4326)");
        }
    }
}
