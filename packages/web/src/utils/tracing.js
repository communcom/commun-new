// eslint-disable-next-line import/no-mutable-exports
let tracer = null;

if (!process.browser) {
  // eslint-disable-next-line no-inner-declarations
  function start() {
    if (!process.env.TRACING_ENABLED || process.env.TRACING_ENABLED === 'false') {
      return;
    }

    const host = process.env.TRACING_AGENT_HOST || '127.0.0.1';
    const port = process.env.TRACING_AGENT_PORT || 6832;

    // eslint-disable-next-line global-require
    const { initTracer } = require('jaeger-client');

    const config = {
      serviceName: 'frontend',
      reporter: {
        logSpans: true,
        agentHost: host,
        agentPort: port,
      },
      sampler: {
        type: 'probabilistic',
        param: 1,
      },
    };

    const branch = process.env.WEB_BRANCH_NAME;
    const commit = process.env.WEB_COMMIT_HASH;

    const tags = {};

    if (branch) {
      tags.branch = branch;
    }

    if (commit) {
      tags.commit = commit.substr(0, 7);
    }

    tracer = initTracer(config, {
      contextKey: 'commun-trace-id',
      tags,
    });
  }

  start();
}

function initTracing(req, res, startTime) {
  if (!tracer) {
    return null;
  }

  const tags = {
    'route.url': req.url,
  };

  const cfRay = req.get['cf-ray'];
  if (cfRay) {
    tags['cf-ray'] = cfRay;
  }

  const cfRequestId = req.get['cf-request-id'];
  if (cfRequestId) {
    tags['cf-request-id'] = cfRequestId;
  }

  const rootSpan = tracer.startSpan('page_request', {
    tags,
    startTime,
  });

  const tracing = {
    tracer,
    rootSpan,
    renderSpan: null,
    startRender: () => {
      tracing.renderSpan = tracing.tracer.startSpan('render', {
        childOf: tracing.rootSpan,
      });
    },
  };

  req.tracing = tracing;

  const { end } = res;
  res.end = (...args) => {
    if (tracing.renderSpan) {
      tracing.renderSpan.finish();
    }

    tracing.rootSpan.setTag('status-code', res.statusCode);
    tracing.rootSpan.finish();
    return end.apply(res, args);
  };

  return tracing;
}

module.exports = {
  initTracing,
};
