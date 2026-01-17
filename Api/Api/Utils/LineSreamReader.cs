using System;
using System.Text;
using System.Text.RegularExpressions;

namespace Api.Utils;

public delegate void OnReceivedStringHandler(string line);
public delegate void OnCancelStreamHandler();

public class LineSreamReader
{
    private StreamReader _streamReader;
    private StringBuilder _stringBuilder;
    private readonly ILogger _logger;
    private readonly LogLevel _logLevel;
    private readonly bool _logingEnabled;

    public event OnReceivedStringHandler OnReceivedString;
    public event OnCancelStreamHandler OnCancelStream;

    private OnCancelStreamHandler onCancelStreamHandler = null;
    private OnReceivedStringHandler onReceivedStringHandler = null;

    public LineSreamReader(StreamReader streamReader, ILogger logger, LogLevel logLevel = LogLevel.Information, bool logingEnabled=false)
    {
        _streamReader = streamReader;
        _stringBuilder = new StringBuilder();
        _logger = logger;
        _logLevel = logLevel;
        _logingEnabled = logingEnabled;  
        
        Task.Factory.StartNew(Run, CancellationToken.None, TaskCreationOptions.DenyChildAttach, TaskScheduler.Default);

    }

    public Task<Match> WaitForString(Regex regex, int timeout = 5000)
    {
        var tcs = new TaskCompletionSource<Match>();

        var lockObject = new Object();


        void Unsubscribe()
        {
            lock (lockObject)
            {
                OnReceivedString -= onReceivedStringHandler;
                OnCancelStream -= onCancelStreamHandler;
            }
        }

        onReceivedStringHandler = line =>
        {
            var match = regex.Match(line);
            if (match.Success)
            {
                Unsubscribe();
                tcs.SetResult(match);
            }
        };
        onCancelStreamHandler = () =>
        {

            Unsubscribe();
            tcs.SetResult(Match.Empty);
        };

        OnReceivedString += onReceivedStringHandler;
        OnCancelStream += onCancelStreamHandler;

        return tcs.Task;
    }

    private async Task Run()
    {
        var buf = new char[8192];

        while (true)
        {
            var length = await _streamReader.ReadAsync(buf, 0, buf.Length);

            if (length == 0)
            {
                if (_stringBuilder.Length > 0)
                {
                    if (OnReceivedString != null)
                    {
                        OnReceivedString.Invoke(_stringBuilder.ToString());
                        _stringBuilder.Clear();
                    }
                }
                if (OnCancelStream != null)
                {
                    OnCancelStream.Invoke();
                }
                break;
            }

            _stringBuilder.Append(buf.Take(length).ToArray());
            var lines = new string(_stringBuilder.ToString()).Split(['\n'], StringSplitOptions.RemoveEmptyEntries).ToList();

            if (length == buf.Length)
            {
                var rest = lines.Last();
                _stringBuilder.Clear();
                _stringBuilder.Append(rest);
                lines.RemoveAt(lines.Count - 1);
            }
            else
            {
                _stringBuilder.Clear();
            }
            if (_logingEnabled)
            {
                _logger.Log(_logLevel, string.Join(Environment.NewLine, lines));
            }
            foreach (var line in lines)
            {
                if (OnReceivedString != null)
                {
                    OnReceivedString.Invoke(line);
                }
            }
        }

    }

}
