FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

WORKDIR /src
COPY ["src/Mveledziso.Web.Host/Mveledziso.Web.Host.csproj", "src/Mveledziso.Web.Host/"]
COPY ["src/Mveledziso.Web.Core/Mveledziso.Web.Core.csproj", "src/Mveledziso.Web.Core/"]
COPY ["src/Mveledziso.Application/Mveledziso.Application.csproj", "src/Mveledziso.Application/"]
COPY ["src/Mveledziso.Core/Mveledziso.Core.csproj", "src/Mveledziso.Core/"]
COPY ["src/Mveledziso.EntityFrameworkCore/Mveledziso.EntityFrameworkCore.csproj", "src/Mveledziso.EntityFrameworkCore/"]
WORKDIR "/src/src/Mveledziso.Web.Host"
RUN dotnet restore 

WORKDIR /src
COPY ["src/Mveledziso.Web.Host", "src/Mveledziso.Web.Host"]
COPY ["src/Mveledziso.Web.Core", "src/Mveledziso.Web.Core"]
COPY ["src/Mveledziso.Application", "src/Mveledziso.Application"]
COPY ["src/Mveledziso.Core", "src/Mveledziso.Core"]
COPY ["src/Mveledziso.EntityFrameworkCore", "src/Mveledziso.EntityFrameworkCore"]
WORKDIR "/src/src/Mveledziso.Web.Host"
RUN dotnet publish -c Release -o /publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:8.0
EXPOSE 80
WORKDIR /app
COPY --from=build /publish .
ENTRYPOINT ["dotnet", "Mveledziso.Web.Host.dll"]
