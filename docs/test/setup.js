
mocha.setup('bdd')
mocha.checkLeaks()
function runTests () {
  function cloneSuiteTests (suite) {
    return {
      tests: suite.tests.map(test => ({ ...test })),
      suites: suite.suites.map(suite => cloneSuiteTests(suite))
    }
  }
  function resetSuiteTests (suite, suiteTestsClone) {
    suite.tests.forEach((test, i) => {
      Object.keys(test).forEach(key => delete test[key])
      Object.assign(test, suiteTestsClone.tests[i])
    })
    suite.suites.forEach((suite, i) => resetSuiteTests(suite, suiteTestsClone.suites[i]))
  }
  function countSuiteTests (suite) {
    const count = { passed: 0, failed: 0 }
    suite.tests.forEach(test => count[test.state]++)
    suite.suites.forEach(suite => {
      const subCount = countSuiteTests(suite)
      count.passed += subCount.passed
      count.failed += subCount.failed
    })
    return count
  }
  const suiteTestsClone = cloneSuiteTests(mocha.suite)
  document.querySelector('#mocha').textContent = ''
  return new Promise(resolve => {
    mocha.run(() => {
      const count = countSuiteTests(mocha.suite)
      resetSuiteTests(mocha.suite, suiteTestsClone)
      resolve(count)
    })
  })
}