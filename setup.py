from setuptools import setup, find_packages

setup(
    name='guardian-cli',
    version='1.0.0',
    packages=find_packages(),
    include_package_data=True,
    install_requires=[
        'click>=8.0.0',
        'rich>=10.0.0',
        'tqdm>=4.60.0',
        'reportlab>=3.6.0',
    ],
    entry_points={
        'console_scripts': [
            'guardian=guardian_cli.guardian:cli',
        ],
    },
    author='Aegis',
    description='Guardian Automated Hardening Tool',
    python_requires='>=3.7',
)