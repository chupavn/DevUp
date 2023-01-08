using System;
using System.Runtime.Caching;
using System.Threading;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace DevUp.Helpers;

internal class MemoryCacheClient : ICacheClient
{
    public T Get<T>(string key)
    {
        if (key == null) throw new ArgumentNullException(nameof(key));
        string storedValue = GetString(key);
        return storedValue != null ? JsonConvert.DeserializeObject<T>(storedValue) : default;
    }

    public string GetString(string key)
    {
        if (key == null) throw new ArgumentNullException(nameof(key));
        return MemoryCache.Default.Get(key) as string;
    }

    public void SetString(string key, string value)
    {
        if (key == null) throw new ArgumentNullException(nameof(key));
        MemoryCache.Default.Set(key, value, new CacheItemPolicy { Priority = CacheItemPriority.NotRemovable });
    }

    public void SetString(string key, string value, TimeSpan expiresIn)
    {
        if (key == null) throw new ArgumentNullException(nameof(key));
        MemoryCache.Default.Set(key, value, DateTimeOffset.Now.Add(expiresIn));
    }

    public void SetString(string key, string value, DateTimeOffset expiresAt)
    {
        if (key == null) throw new ArgumentNullException(nameof(key));
        MemoryCache.Default.Set(key, value, expiresAt);
    }

    public void Set<T>(string key, T value)
    {
        if (key == null) throw new ArgumentNullException(nameof(key));
        string valueJson = JsonConvert.SerializeObject(value);
        SetString(key, valueJson);
    }

    public void Set<T>(string key, T value, TimeSpan expiresIn)
    {
        if (key == null) throw new ArgumentNullException(nameof(key));
        string valueJson = JsonConvert.SerializeObject(value);
        SetString(key, valueJson, expiresIn);
    }

    public void Set<T>(string key, T value, DateTimeOffset expiresAt)
    {
        if (key == null) throw new ArgumentNullException(nameof(key));
        string valueJson = JsonConvert.SerializeObject(value);
        SetString(key, valueJson, expiresAt);
    }

    public void Remove(string key)
    {
        if (key == null) throw new ArgumentNullException(nameof(key));
        if (MemoryCache.Default.Contains(key))
        {
            MemoryCache.Default.Remove(key);
        }
    }

    public Task<T> GetAsync<T>(string key, CancellationToken cancellationToken = default)
    {
        if (key == null) throw new ArgumentNullException(nameof(key));
        return Task.FromResult(Get<T>(key));
    }

    public Task<string> GetStringAsync(string key, CancellationToken cancellationToken = default)
    {
        if (key == null) throw new ArgumentNullException(nameof(key));
        return Task.FromResult(GetString(key));
    }

    public Task SetStringAsync(string key, string value, CancellationToken cancellationToken = default)
    {
        if (key == null) throw new ArgumentNullException(nameof(key));
        SetString(key, value);
        
        return Task.CompletedTask;
    }

    public Task SetStringAsync(string key, string value, TimeSpan expiresIn, CancellationToken cancellationToken = default)
    {
        if (key == null) throw new ArgumentNullException(nameof(key));
        SetString(key, value, expiresIn);

        return Task.CompletedTask;
    }

    public Task SetStringAsync(string key, string value, DateTimeOffset expiresAt, CancellationToken cancellationToken = default)
    {
        if (key == null) throw new ArgumentNullException(nameof(key));
        SetString(key, value, expiresAt);
        
        return Task.CompletedTask;
    }

    public Task SetAsync<T>(string key, T value, CancellationToken cancellationToken = default)
    {
        if (key == null) throw new ArgumentNullException(nameof(key));
        Set(key, value);

        return Task.CompletedTask;
    }

    public Task SetAsync<T>(string key, T value, TimeSpan expiresIn, CancellationToken cancellationToken = default)
    {
        if (key == null) throw new ArgumentNullException(nameof(key));
        Set(key, value, expiresIn);

        return Task.CompletedTask;
    }

    public Task SetAsync<T>(string key, T value, DateTimeOffset expiresAt, CancellationToken cancellationToken = default)
    {
        if (key == null) throw new ArgumentNullException(nameof(key));
        Set(key, value, expiresAt);

        return Task.CompletedTask;
    }

    public Task RemoveAsync(string key, CancellationToken cancellationToken = default)
    {
        if (key == null) throw new ArgumentNullException(nameof(key));
        Remove(key);

        return Task.CompletedTask;
    }
}
