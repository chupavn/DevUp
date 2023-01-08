using System;
using System.Diagnostics.CodeAnalysis;
using System.Threading;
using System.Threading.Tasks;
using JetBrains.Annotations;

namespace DevUp.Helpers;

public interface ICacheClient
{
    T Get<T>([NotNull] string key);
    string GetString([NotNull] string key);
    void SetString([NotNull] string key, string value);
    void SetString([NotNull] string key, string value, TimeSpan expiresIn);
    void SetString([NotNull] string key, string value, DateTimeOffset expiresAt);
    void Set<T>([NotNull] string key, T value);
    void Set<T>([NotNull] string key, T value, TimeSpan expiresIn);
    void Set<T>([NotNull] string key, T value, DateTimeOffset expiresAt);
    void Remove([NotNull] string key);
    Task<T> GetAsync<T>([NotNull] string key, CancellationToken cancellationToken = default);
    Task<string> GetStringAsync([NotNull] string key, CancellationToken cancellationToken = default);
    Task SetStringAsync([NotNull] string key, string value, CancellationToken cancellationToken = default);
    Task SetStringAsync([NotNull] string key, string value, TimeSpan expiresIn, CancellationToken cancellationToken = default);
    Task SetStringAsync([NotNull] string key, string value, DateTimeOffset expiresAt, CancellationToken cancellationToken = default);
    Task SetAsync<T>([NotNull] string key, T value, CancellationToken cancellationToken = default);
    Task SetAsync<T>([NotNull] string key, T value, TimeSpan expiresIn, CancellationToken cancellationToken = default);
    Task SetAsync<T>([NotNull] string key, T value, DateTimeOffset expiresAt, CancellationToken cancellationToken = default);
    Task RemoveAsync([NotNull] string key, CancellationToken cancellationToken = default);
}
