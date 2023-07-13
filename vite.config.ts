/* eslint-disable camelcase, @typescript-eslint/no-magic-numbers */
// eslint-env node
import { readFileSync } from 'fs';
import { resolve } from 'path';

import { defineConfig, type UserConfig } from 'vitest/config';
import { type ManifestOptions, VitePWA as vitePWA } from 'vite-plugin-pwa';
import htmlMinifier from 'vite-plugin-html-minifier';

import { externalResources, internalResources, shareTarget } from './src/service-worker';

const sslOptions = {
	cert: readFileSync('./certs/server.crt'),
	key: readFileSync('./certs/server.key')
};

const manifest: Partial<ManifestOptions> = JSON.parse(readFileSync('./src/manifest.json', { encoding: 'utf8' }));

export default defineConfig(({ mode }) => {
	const baseUrl = mode === 'production' ? 'https://madcampos.dev/talks/web-components' : 'https://localhost:3000/';

	const config: UserConfig = {
		plugins: [
			htmlMinifier({
				minify: {
					collapseWhitespace: true,
					keepClosingSlash: false,
					removeComments: true,
					removeRedundantAttributes: true,
					removeScriptTypeAttributes: false,
					removeStyleLinkTypeAttributes: true,
					removeEmptyAttributes: true,
					useShortDoctype: true,
					minifyCSS: false,
					minifyJS: false,
					minifyURLs: false
				}
			}),
			vitePWA({
				registerType: 'prompt',
				minify: true,
				includeAssets: ['/icons/favicon.svg'],
				manifest,
				scope: baseUrl,
				workbox: {
					cleanupOutdatedCaches: true,
					clientsClaim: true,
					navigationPreload: false,
					runtimeCaching: [
						internalResources,
						externalResources,
						shareTarget
					]
				},
				devOptions: {
					enabled: false
				}
			})
		],
		base: baseUrl,
		envPrefix: 'APP_',
		envDir: '../',
		root: 'src',
		publicDir: '../public',
		clearScreen: false,
		server: {
			host: 'localhost',
			https: sslOptions,
			open: false,
			cors: true,
			port: 3000
		},
		build: {
			target: 'esnext',
			emptyOutDir: true,
			outDir: '../dist',
			rollupOptions: {
				input: {
					main: resolve('src/index.html')
				},
				output: {
					generatedCode: 'es2015',
					inlineDynamicImports: false
				}
			}
		},
		preview: {
			https: sslOptions,
			open: true
		},
		test: {
			include: ['**/*.test.ts'],
			minThreads: 1,
			maxThreads: 4,
			passWithNoTests: true,
			maxConcurrency: 4,
			coverage: {
				functions: 75,
				branches: 75,
				lines: 75,
				statements: 75
			}
		}
	};

	return config;
});
