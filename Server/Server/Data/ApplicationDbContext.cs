using Microsoft.EntityFrameworkCore;
using Server.Models;

namespace Server.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Machine> Machines { get; set; }
        public DbSet<Tube> Tubes { get; set; }
        public DbSet<Location> Locations { get; set; }
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure Machine entity
            modelBuilder.Entity<Machine>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
                entity.Property(e => e.PlcVersion).IsRequired().HasMaxLength(100);
                entity.Property(e => e.AcsVersion).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Owner).IsRequired().HasMaxLength(200);
                entity.Property(e => e.TeamviewerName).IsRequired().HasMaxLength(200);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");

                // Configure enum to string conversion
                entity.Property(e => e.Status)
                    .HasConversion<string>()
                    .HasMaxLength(50);

                entity.Property(e => e.Model)
                    .HasConversion<string>()
                    .HasMaxLength(50);

                // Configure many-to-one relationship with Location
                entity.HasOne(e => e.Location)
                    .WithMany(l => l.Machines)
                    .HasForeignKey(e => e.LocationId)
                    .OnDelete(DeleteBehavior.Restrict);

                // Configure one-to-many relationship with Tubes
                entity.HasMany(e => e.Tubes)
                    .WithOne(t => t.Machine)
                    .HasForeignKey(t => t.MachineId)
                    .OnDelete(DeleteBehavior.Cascade);

                // Create index on Name for faster searches
                entity.HasIndex(e => e.Name);
                entity.HasIndex(e => e.Status);
                entity.HasIndex(e => e.LocationId);
            });

            // Configure Tube entity
            modelBuilder.Entity<Tube>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.TubeIndex).IsRequired();
                
                entity.Property(e => e.TubeType)
                    .HasConversion<string>()
                    .HasMaxLength(50);

            // Configure Location entity
            modelBuilder.Entity<Location>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Country).IsRequired().HasMaxLength(100);
                entity.Property(e => e.City).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Latitude).IsRequired();
                entity.Property(e => e.Longitude).IsRequired();

                // Create unique index for country + city combination
                entity.HasIndex(e => new { e.Country, e.City }).IsUnique();
            });

            // Configure User entity
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Email).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Username).IsRequired().HasMaxLength(50);
                entity.Property(e => e.PasswordHash).IsRequired();
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");

                // Create unique index on Email
                entity.HasIndex(e => e.Email).IsUnique();
                entity.HasIndex(e => e.Username);
            });

                // Create composite index for machine and tube index
                entity.HasIndex(e => new { e.MachineId, e.TubeIndex });
            });
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            // Update UpdatedAt timestamp for modified entities
            var entries = ChangeTracker.Entries<Machine>()
                .Where(e => e.State == EntityState.Modified);

            foreach (var entry in entries)
            {
                entry.Entity.UpdatedAt = DateTime.UtcNow;
            }

            return base.SaveChangesAsync(cancellationToken);
        }
    }
}
