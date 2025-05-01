using Mveledziso.Debugging;

namespace Mveledziso;

public class MveledzisoConsts
{
    public const string LocalizationSourceName = "Mveledziso";

    public const string ConnectionStringName = "Default";

    public const bool MultiTenancyEnabled = true;


    /// <summary>
    /// Default pass phrase for SimpleStringCipher decrypt/encrypt operations
    /// </summary>
    public static readonly string DefaultPassPhrase =
        DebugHelper.IsDebug ? "gsKxGZ012HLL3MI5" : "f603cd4bda86404da231eebaf9808598";
}
