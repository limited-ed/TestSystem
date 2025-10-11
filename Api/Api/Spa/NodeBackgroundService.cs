using System;
using System.Diagnostics;
using Api.Models.Options;
using Api.Utils;

namespace Api.Spa;

public class NodeBackgroundService : BackgroundService
{

    private readonly ILogger<NodeBackgroundService> _logger;
    private readonly SpaServicesOptions _spaOptions;
    private Process _process;

    public NodeBackgroundService(ILogger<NodeBackgroundService> logger, IConfiguration configuration)
    {
        _logger = logger;
        _spaOptions = new SpaServicesOptions();
        configuration.GetSection(SpaServicesOptions.SpaServices).Bind(_spaOptions);
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        if (_spaOptions.NodeServer.StartNodeServer)
        {
            _logger.LogInformation(@"Starting Node server");
            var processStartInfo = new ProcessStartInfo("node.exe")
            {
                UseShellExecute = false,
                Arguments = _spaOptions.NodeServer.Path,
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                RedirectStandardInput = true,
                CreateNoWindow = true
            };

            _process = Process.Start(processStartInfo);
            var reader = new LineSreamReader(_process.StandardOutput, _logger, LogLevel.Error, true);
                                      var errorReader = new LineSreamReader(_process.StandardError, _logger, LogLevel.Error, true);

            await Task.Delay(Timeout.Infinite, stoppingToken);
        }
    }

    public override async Task StopAsync(CancellationToken cancellationToken)
    {
        if (_spaOptions.NodeServer.StartNodeServer)
        {
            if (_process != null && !_process.HasExited)
            {
                _process.Close();
                if (!_process.WaitForExit(TimeSpan.FromSeconds(5))) { }
                {
                    _process.Kill();
                }
            }

            await base.StopAsync(cancellationToken);
        }
    }
}
