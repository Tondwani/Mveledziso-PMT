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
    public virtual DbSet<Timeline> Timelines { get; set; }
    public virtual DbSet<UserTeam> UserTeams { get; set; }
    public virtual DbSet<Milestone> Milestones { get; set; }
    public virtual DbSet<TimelinePhase> TimelinePhases { get; set; }
    public virtual DbSet<Comment> Comments { get; set; }
    public virtual DbSet<Notification> Notifications { get; set; }
    public virtual DbSet<ActivityLog> ActivityLogs { get; set; }

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

        // Timeline - Project (one-to-one)
        modelBuilder.Entity<Timeline>()
            .HasOne(t => t.Project)
            .WithOne(p => p.Timeline)
            .HasForeignKey<Timeline>(t => t.ProjectId)
            .OnDelete(DeleteBehavior.Cascade);

        // Milestone - Timeline (many-to-one)
        modelBuilder.Entity<Milestone>()
            .HasOne(m => m.Timeline)
            .WithMany(t => t.Milestones)
            .HasForeignKey(m => m.TimelineId)
            .OnDelete(DeleteBehavior.Cascade);

        // TimelinePhase - Timeline (many-to-one)
        modelBuilder.Entity<TimelinePhase>()
            .HasOne(tp => tp.Timeline)
            .WithMany(t => t.Phases)
            .HasForeignKey(tp => tp.TimelineId)
            .OnDelete(DeleteBehavior.Cascade);

        // UserTeam - Team (many-to-one)
        modelBuilder.Entity<UserTeam>()
            .HasOne(ut => ut.Team)
            .WithMany(t => t.Members)
            .HasForeignKey(ut => ut.TeamId)
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

        modelBuilder.Entity<UserTeam>()
            .HasIndex(ut => ut.TeamId);

        modelBuilder.Entity<UserTeam>()
            .HasIndex(ut => ut.UserId);

        modelBuilder.Entity<Milestone>()
            .HasIndex(m => m.TimelineId);

        modelBuilder.Entity<TimelinePhase>()
            .HasIndex(tp => tp.TimelineId);

        modelBuilder.Entity<Comment>()
            .HasIndex(c => new { c.EntityType, c.EntityId });

        modelBuilder.Entity<Notification>()
            .HasIndex(n => n.UserId);

        modelBuilder.Entity<ActivityLog>()
            .HasIndex(al => new { al.EntityType, al.EntityId });

        // Required fields
        modelBuilder.Entity<UserDuty>()
            .Property(ud => ud.UserId)
            .IsRequired();

        modelBuilder.Entity<UserTeam>()
            .Property(ut => ut.UserId)
            .IsRequired();

        modelBuilder.Entity<Comment>()
            .Property(c => c.UserId)
            .IsRequired();

        modelBuilder.Entity<Notification>()
            .Property(n => n.UserId)
            .IsRequired();

        modelBuilder.Entity<ActivityLog>()
            .Property(al => al.UserId)
            .IsRequired();

        // Configure polymorphic relationships
        modelBuilder.Entity<Comment>()
            .Property(c => c.EntityType)
            .IsRequired()
            .HasMaxLength(50);

        modelBuilder.Entity<Comment>()
            .Property(c => c.EntityId)
            .IsRequired();

        modelBuilder.Entity<Notification>()
            .Property(n => n.EntityType)
            .HasMaxLength(50);

        modelBuilder.Entity<ActivityLog>()
            .Property(al => al.EntityType)
            .IsRequired()
            .HasMaxLength(50);

        modelBuilder.Entity<ActivityLog>()
            .Property(al => al.EntityId)
            .IsRequired();
    }
}