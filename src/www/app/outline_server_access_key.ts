// Copyright 2018 The Outline Authors
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {Config, makeConfig, SHADOWSOCKS_URI, SIP002_URI} from 'ShadowsocksConfig';
import * as errors from '../model/errors';
import {ShadowsocksConfig} from './config';

export function parseAccessKey(accessKey: string): Config {
  try {
    return SHADOWSOCKS_URI.parse(accessKey);
  } catch (error) {
    throw new errors.ServerUrlInvalid(error.message || 'failed to parse access key');
  }
}

// Parses an access key string into a ShadowsocksConfig object.
export function accessKeyToShadowsocksConfig(accessKey: string): ShadowsocksConfig {
  try {
    const {
      host: {data: host},
      port: {data: port},
      method: {data: method},
      password: {data: password},
      tag: {data: name},
    } = parseAccessKey(accessKey);

    return {
      host,
      port,
      method,
      password,
      name,
    };
  } catch (error) {
    throw new errors.ServerUrlInvalid(error.message || 'failed to parse access key');
  }
}

// Encodes a Shadowsocks proxy configuration into an access key string.
export function shadowsocksConfigToAccessKey(config: ShadowsocksConfig): string {
  return SIP002_URI.stringify(
    makeConfig({
      host: config.host,
      port: config.port,
      method: config.method,
      password: config.password,
      tag: config.name,
    })
  );
}

// Compares access keys proxying parameters.
export function accessKeysMatch(a: string, b: string): boolean {
  try {
    const l = accessKeyToShadowsocksConfig(a);
    const r = accessKeyToShadowsocksConfig(b);
    return l.host === r.host && l.port === r.port && l.password === r.password && l.method === r.method;
  } catch (e) {
    console.debug(`failed to parse access key for comparison`);
  }
  return false;
}
