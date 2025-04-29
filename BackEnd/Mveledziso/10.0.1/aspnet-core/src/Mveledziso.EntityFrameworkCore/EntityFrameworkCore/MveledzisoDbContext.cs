using Abp.Zero.EntityFrameworkCore;
using Mveledziso.Authorization.Roles;
using Mveledziso.Authorization.Users;
using Mveledziso.MultiTenancy;
using Microsoft.EntityFrameworkCore;
using Mveledziso.Domain.Entities;
using System.Collections.Generic;

namespace Mveledziso.EntityFrameworkCore;

public class MveledzisoDbContext : AbpZeroDbContext<Tenant, Role, User, MveledzisoDbContext>
{
    /* Define a DbSet for each entity of the application */

    public virtual DbSet<Project> Projects { get; set; }
    public virtual DbSet<ProjectDuty> ProjectDuties { get; set; }
    public virtual DbSet<Team> Teams { get; set; }
    public virtual DbSet<Document> Documents { get; set; }
    public virtual DbSet<UserDuty> UserDuties { get; set; }

    public MveledzisoDbContext(DbContextOptions<MveledzisoDbContext> options)
        : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Project - Team (many-to-one)
        modelBuilder.Entity<Project>()
            .HasOne(p => p.Team)
            .WithMany(t => t.Projects)
            .HasForeignKey(p => p.TeamId)
            .OnDelete(DeleteBehavior.Restrict);

        // ProjectDuty - Project (many-to-one)
        modelBuilder.Entity<ProjectDuty>()
            .HasOne(d => d.Project)
            .WithMany(p => p.Duties)
            .HasForeignKey(d => d.ProjectId)
            .OnDelete(DeleteBehavior.Cascade);

        // UserDuty - ProjectDuty relationship
        modelBuilder.Entity<UserDuty>()
            .HasOne(ud => ud.ProjectDuty)
            .WithMany(d => d.UserDuties)
            .HasForeignKey(ud => ud.ProjectDutyId)
            .OnDelete(DeleteBehavior.Cascade);

        // Document - ProjectDuty relationship
        modelBuilder.Entity<Document>()
            .HasOne(d => d.ProjectDuty)
            .WithMany(duty => duty.Documents)
            .HasForeignKey(d => d.ProjectDutyId)
            .OnDelete(DeleteBehavior.Cascade);

        // Create indexes for better performance
        modelBuilder.Entity<ProjectDuty>()
            .HasIndex(d => d.ProjectId);

        modelBuilder.Entity<UserDuty>()
            .HasIndex(ud => ud.ProjectDutyId);

        modelBuilder.Entity<UserDuty>()
            .HasIndex(ud => ud.UserId);

        modelBuilder.Entity<Document>()
            .HasIndex(d => d.ProjectDutyId);

        modelBuilder.Entity<UserDuty>()
            .Property(ud => ud.UserId)
            .IsRequired();
    }
}
